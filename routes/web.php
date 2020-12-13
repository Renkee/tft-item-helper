<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReadOnlyController;
use App\Http\Controllers\BuildController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::get('api/readonly/champions', [ReadOnlyController::class, 'champions']);
Route::get('api/readonly/components', [ReadOnlyController::class, 'components']);
Route::get('api/readonly/components_to_completed', [ReadOnlyController::class, 'components_to_completed']);
Route::get('api/readonly/completed', [ReadOnlyController::class, 'completed']);
Route::get('api/builds', [BuildController::class, 'index']);
Route::get('api/builds/{id}', [BuildController::class, 'show']);
Route::post('api/builds', [BuildController::class, 'store']);
Route::patch('api/builds/{id}', [BuildController::class, 'update']);
Route::delete('api/builds/{id}', [BuildController::class, 'destroy']);
Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');