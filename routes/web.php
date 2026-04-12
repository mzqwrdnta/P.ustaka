<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::get('/', function (\Illuminate\Http\Request $request) {
    $query = \App\Models\Book::query()->where('status', 'aktif');

    if ($request->search) {
        $search = $request->search;
        $query->where(function($q) use ($search) {
            $q->where('judul', 'like', "%{$search}%")
              ->orWhere('penulis', 'like', "%{$search}%")
              ->orWhere('kategori', 'like', "%{$search}%");
        });
    }

    if ($request->kategori && $request->kategori !== 'Semua') {
        $query->where('kategori', $request->kategori);
    }

    $books = $query->orderByRaw('stok > 0 DESC')->latest()->get();
    
    // Get distinct categories
    $categories = \App\Models\Book::where('status', 'aktif')
                                  ->select('kategori')
                                  ->distinct()
                                  ->pluck('kategori')
                                  ->filter()
                                  ->values();

    $stats = [
        ['num' => \App\Models\Book::where('status', 'aktif')->count(), 'label' => 'Buku Tersedia'],
        ['num' => \App\Models\Book::where('status', 'aktif')->distinct('penulis')->count(), 'label' => 'Penulis'],
        ['num' => \App\Models\Member::where('status_aktif', 1)->count(), 'label' => 'Total Anggota'],
    ];

    $featuredBooks = \App\Models\Book::where('status', 'aktif')->inRandomOrder()->take(2)->get();

    return \Inertia\Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'dbBooks' => $books,
        'dbCategories' => $categories,
        'stats' => $stats,
        'featuredBooks' => $featuredBooks,
        'filters' => $request->only(['search', 'kategori'])
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function() {
        if (auth()->user()->role === 'admin') {
            return redirect()->route('admin.dashboard');
        }
        return redirect()->route('user.books.index');
    })->name('dashboard');

    // Profile Completion (for Users)
    Route::get('/user/profile/complete', [\App\Http\Controllers\MemberProfileController::class, 'create'])->name('user.profile.complete');
    Route::post('/user/profile/complete', [\App\Http\Controllers\MemberProfileController::class, 'store'])->name('user.profile.store');

    // User Routes
    Route::middleware(['member.profile'])->prefix('user')->name('user.')->group(function() {
        Route::redirect('/dashboard', '/user/books')->name('dashboard');
        
        Route::get('/books', [\App\Http\Controllers\UserBookController::class, 'index'])->name('books.index');
        Route::post('/books/{book}/borrow', [\App\Http\Controllers\UserBookController::class, 'borrow'])->name('books.borrow');
        Route::get('/transactions', [\App\Http\Controllers\UserTransactionController::class, 'index'])->name('transactions.index');
        Route::post('/transactions/{transaction}/return', [\App\Http\Controllers\UserTransactionController::class, 'returnBook'])->name('transactions.return');
    });

    // Admin Routes
    Route::middleware(['admin'])->prefix('admin')->name('admin.')->group(function() {
        Route::get('/dashboard', [\App\Http\Controllers\AdminDashboardController::class, 'index'])->name('dashboard');
        
        Route::resource('books', \App\Http\Controllers\AdminBookController::class);
        Route::resource('members', \App\Http\Controllers\AdminMemberController::class);
        
        Route::get('/transactions/borrows', [\App\Http\Controllers\AdminTransactionController::class, 'borrows'])->name('transactions.borrows');
        Route::get('/transactions/returns', [\App\Http\Controllers\AdminTransactionController::class, 'returns'])->name('transactions.returns');
        Route::get('/transactions/{transaction}', [\App\Http\Controllers\AdminTransactionController::class, 'show'])->name('transactions.show');
        Route::post('/transactions/{transaction}/verify-borrow', [\App\Http\Controllers\AdminTransactionController::class, 'verifyBorrow'])->name('transactions.verify.borrow');
        Route::post('/transactions/{transaction}/reject-borrow', [\App\Http\Controllers\AdminTransactionController::class, 'rejectBorrow'])->name('transactions.reject.borrow');
        Route::post('/transactions/{transaction}/verify-return', [\App\Http\Controllers\AdminTransactionController::class, 'verifyReturn'])->name('transactions.verify.return');
        Route::post('/transactions/{transaction}/pay-fine', [\App\Http\Controllers\AdminTransactionController::class, 'payFine'])->name('transactions.pay_fine');

        Route::get('/settings', [\App\Http\Controllers\AdminSettingController::class, 'index'])->name('settings.index');
        Route::post('/settings', [\App\Http\Controllers\AdminSettingController::class, 'store'])->name('settings.store');
        
        // report
        Route::get('/reports', [\App\Http\Controllers\AdminReportController::class, 'index'])->name('reports.index');

        Route::get('/reports/export-excel', [\App\Http\Controllers\AdminReportController::class, 'exportExcel'])->name('reports.export.excel');

        Route::get('/reports/export-pdf', [\App\Http\Controllers\AdminReportController::class, 'exportPdf'])->name('reports.export.pdf');
    });
});

require __DIR__.'/settings.php';
