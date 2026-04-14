<?php

use App\Http\Controllers\AdminBookController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\AdminFineController;
use App\Http\Controllers\AdminMemberController;
use App\Http\Controllers\AdminReportController;
use App\Http\Controllers\AdminSettingController;
use App\Http\Controllers\AdminTransactionController;
use App\Http\Controllers\MemberProfileController;
use App\Http\Controllers\UserBookController;
use App\Http\Controllers\UserTransactionController;
use App\Models\Book;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function (Request $request) {
    $query = Book::query()->where('status', 'aktif');

    if ($request->search) {
        $search = $request->search;
        $query->where(function ($q) use ($search) {
            $q->where('judul', 'like', "%{$search}%")
                ->orWhere('penulis', 'like', "%{$search}%")
                ->orWhere('kategori', 'like', "%{$search}%");
        });
    }

    if ($request->kategori && $request->kategori !== 'Semua' && $request->kategori !== '') {
        $query->whereRaw('LOWER(kategori) = ?', [strtolower($request->kategori)]);
    }

    $books = $query->orderByRaw('stok > 0 DESC')->latest()->get();

    // Get distinct categories
    $categories = Book::where('status', 'aktif')
        ->pluck('kategori')
        ->filter()
        ->map(fn ($k) => ucwords(strtolower($k)))
        ->unique()
        ->values();

    $stats = [
        ['num' => Book::where('status', 'aktif')->count(), 'label' => 'Buku Tersedia'],
        ['num' => Book::where('status', 'aktif')->distinct('penulis')->count(), 'label' => 'Penulis'],
        ['num' => Member::where('status_aktif', 1)->count(), 'label' => 'Total Anggota'],
    ];

    $featuredBooks = Book::where('status', 'aktif')->inRandomOrder()->take(2)->get();

    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'dbBooks' => $books,
        'dbCategories' => $categories,
        'stats' => $stats,
        'featuredBooks' => $featuredBooks,
        'filters' => $request->only(['search', 'kategori']),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        if (auth()->user()->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }

        return redirect()->route('user.books.index');
    })->name('dashboard');

    // Profile Completion (for Users)
    Route::get('/user/profile/complete', [MemberProfileController::class, 'create'])->name('user.profile.complete');
    Route::post('/user/profile/complete', [MemberProfileController::class, 'store'])->name('user.profile.store');

    // User Routes
    Route::middleware(['member.profile'])->prefix('user')->name('user.')->group(function () {
        Route::redirect('/dashboard', '/user/books')->name('dashboard');

        Route::get('/books', [UserBookController::class, 'index'])->name('books.index');
        Route::post('/books/{book}/borrow', [UserBookController::class, 'borrow'])->name('books.borrow');
        Route::get('/transactions', [UserTransactionController::class, 'index'])->name('transactions.index');
        Route::post('/transactions/{transaction}/return', [UserTransactionController::class, 'returnBook'])->name('transactions.return');
    });

    // Admin Routes
    Route::middleware(['admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

        Route::resource('books', AdminBookController::class);
        Route::resource('members', AdminMemberController::class);

        Route::get('/transactions/borrows', [AdminTransactionController::class, 'borrows'])->name('transactions.borrows');
        Route::get('/transactions/returns', [AdminTransactionController::class, 'returns'])->name('transactions.returns');
        Route::get('/transactions/{transaction}', [AdminTransactionController::class, 'show'])->name('transactions.show');
        Route::post('/transactions/{transaction}/verify-borrow', [AdminTransactionController::class, 'verifyBorrow'])->name('transactions.verify.borrow');
        Route::post('/transactions/{transaction}/reject-borrow', [AdminTransactionController::class, 'rejectBorrow'])->name('transactions.reject.borrow');
        Route::post('/transactions/{transaction}/verify-return', [AdminTransactionController::class, 'verifyReturn'])->name('transactions.verify.return');
        Route::post('/transactions/{transaction}/pay-fine', [AdminTransactionController::class, 'payFine'])->name('transactions.pay_fine');
        Route::post('/transactions/{transaction}/send-reminder', [AdminTransactionController::class, 'sendReminder'])->name('transactions.send_reminder');

        Route::get('/fines', [AdminFineController::class, 'index'])->name('fines.index');
        Route::post('/fines/{transaction}', [AdminFineController::class, 'update'])->name('fines.update');

        Route::get('/settings', [AdminSettingController::class, 'index'])->name('settings.index');
        Route::post('/settings', [AdminSettingController::class, 'store'])->name('settings.store');

        // report
        Route::get('/reports', [AdminReportController::class, 'index'])->name('reports.index');

        Route::get('/reports/export-excel', [AdminReportController::class, 'exportExcel'])->name('reports.export.excel');

        Route::get('/reports/export-pdf', [AdminReportController::class, 'exportPdf'])->name('reports.export.pdf');
    });
});

require __DIR__.'/settings.php';
