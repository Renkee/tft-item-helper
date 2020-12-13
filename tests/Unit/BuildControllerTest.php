<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Http\Controllers\BuildController;
use Mockery;
use Illuminate\Database\Connection;
use Illuminate\Http\Request;

class BuildControllerTest extends TestCase
{
    /* BuildController::store Validation tests */
    public function test_trying_to_store_a_build_with_empty_build_in_request_fails()
    {
        // Setup
        $db = Mockery::mock(Connection::class);
        $controller = new BuildController($db);
        $mockRequest = Mockery::mock(\Illuminate\Http\Request::class)->makePartial();
        $mockRequest->shouldReceive('has')->with('name')->andReturn(true);
        $mockRequest->shouldReceive('input')->with('name')->andReturn("testing");

        $mockRequest->shouldReceive('has')->with('build')->andReturn(true);
        $mockRequest->shouldReceive('input')->with('build')->andReturn([]);

        // Start
        $response = $controller->store($mockRequest);

        // Validate
        $this->assertSame(false, $response->original["success"]);
        $this->assertSame(400, $response->status());
    }
    public function test_trying_to_store_a_build_with_no_build_in_request_fails()
    {
        // Setup
        $db = Mockery::mock(Connection::class);
        $controller = new BuildController($db);
        $mockRequest = Mockery::mock(\Illuminate\Http\Request::class)->makePartial();
        $mockRequest->shouldReceive('has')->with('name')->andReturn(true);
        $mockRequest->shouldReceive('input')->with('name')->andReturn("testing");

        $mockRequest->shouldReceive('has')->with('build')->andReturn(false);

        // Start
        $response = $controller->store($mockRequest);

        // Validate
        $this->assertSame(false, $response->original["success"]);
        $this->assertSame(400, $response->status());
    }
    public function test_trying_to_store_a_build_with_no_name_fails()
    {
        // Setup
        $db = Mockery::mock(Connection::class);
        $controller = new BuildController($db);
        $mockRequest = Mockery::mock(\Illuminate\Http\Request::class)->makePartial();
        $mockRequest->shouldReceive('has')->with('build')->andReturn(true);
        $mockRequest->shouldReceive('input')->with('build')->andReturn([1]);

        $mockRequest->shouldReceive('has')->with('name')->andReturn(false);

        // Start
        $response = $controller->store($mockRequest);

        // Validate
        $this->assertSame(false, $response->original["success"]);
        $this->assertSame(400, $response->status());
    }
    public function test_trying_to_store_a_build_with_empty_name_fails()
    {
        // Setup
        $db = Mockery::mock(Connection::class);
        $controller = new BuildController($db);
        $mockRequest = Mockery::mock(\Illuminate\Http\Request::class)->makePartial();
        $mockRequest->shouldReceive('has')->with('build')->andReturn(true);
        $mockRequest->shouldReceive('input')->with('build')->andReturn([1]);

        $mockRequest->shouldReceive('has')->with('name')->andReturn(true);
        $mockRequest->shouldReceive('input')->with('name')->andReturn("");

        // Start
        $response = $controller->store($mockRequest);

        // Validate
        $this->assertSame(false, $response->original["success"]);
        $this->assertSame(400, $response->status());
    }
}
