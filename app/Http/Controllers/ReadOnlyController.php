<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class ReadOnlyController extends Controller
{
  public function components()
  {
    $components = DB::select('SELECT component_id AS id, name, to_base64(image) AS image FROM ComponentItems;');
    return response()->json($components);
  }
  public function completed()
  {
    $completed = DB::select('SELECT completed_id AS id, name, to_base64(image) AS image, to_base64(image_small) AS image_small FROM CompletedItems;');
    return response()->json($completed);
  }
  public function components_to_completed()
  {
    $components_to_completed = DB::select('SELECT completed_id AS CompletedId, component_id AS ComponentId FROM Completed_Component;');
    return response()->json($components_to_completed);
  }
  public function champions()
  {
    $champions = DB::select('SELECT champion_id as id, name, to_base64(image) AS image, c.price AS price, pc.color AS color
                            FROM Champions c INNER JOIN Price_Color pc ON c.price = pc.price ORDER BY c.champion_id;');
    return response()->json($champions);
  }
}
