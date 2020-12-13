<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\Connection;

class BuildController extends Controller
{
  protected $dbConnection;

  public function __construct(Connection $c)
  {
    $this->dbConnection = $c;
  }

  public function index()
  {
    $builds = $this->dbConnection->select('SELECT b.build_id AS BuildId,
                                                b.name AS BuildName,
                                                cb.champion_build_id AS ChampionBuildId,
                                                c.champion_id AS ChampionId,
                                                cb.order AS ChampionOrder,
                                                ci.completed_id AS CompletedId,
                                                cbc.order AS ItemOrder,
                                                GROUP_CONCAT(coi.component_id) AS ComponentIds,
                                                cbc.champion_build_completed_id AS ChampionBuildCompletedId
                                          FROM Builds b
                                          INNER JOIN Champions_Builds cb ON b.build_id = cb.build_id
                                          INNER JOIN Champions c ON c.champion_id = cb.champion_id
                                          INNER JOIN Price_Color pc ON pc.price = c.price
                                          LEFT JOIN Champions_Builds_Completed cbc ON cb.champion_build_id = cbc.champion_build_id
                                          LEFT JOIN CompletedItems ci ON cbc.completed_id = ci.completed_id
                                          LEFT JOIN Completed_Component cc ON cc.completed_id = ci.completed_id
                                          LEFT JOIN ComponentItems coi ON coi.component_id = cc.component_id
                                          GROUP BY BuildId, BuildName, ChampionBuildId, ChampionId, CompletedId, ChampionBuildCompletedId
                                          ORDER BY b.build_id;');
    return response()->json($builds);
  }

  public function show($id) {
    $build = $this->dbConnection->select('SELECT b.build_id AS BuildId,
                                 b.name AS BuildName,
                                 cb.champion_build_id AS ChampionBuildId,
                                 c.champion_id AS ChampionId,
                                 ci.completed_id AS CompletedId,
                                 GROUP_CONCAT(coi.component_id) AS ComponentIds,
                                 cbc.champion_build_completed_id AS ChampionBuildCompletedId
                          FROM Builds b
                          INNER JOIN Champions_Builds cb ON b.build_id = cb.build_id
                          INNER JOIN Champions c ON c.champion_id = cb.champion_id
                          INNER JOIN Price_Color pc ON pc.price = c.price
                          LEFT JOIN Champions_Builds_Completed cbc ON cb.champion_build_id = cbc.champion_build_id
                          LEFT JOIN CompletedItems ci ON cbc.completed_id = ci.completed_id
                          LEFT JOIN Completed_Component cc ON cc.completed_id = ci.completed_id
                          LEFT JOIN ComponentItems coi ON coi.component_id = cc.component_id
                          WHERE b.build_id = ?
                          GROUP BY BuildId, BuildName, ChampionBuildId, ChampionId, CompletedId, ChampionBuildCompletedId
                          ORDER BY b.build_id;', [$id]);
    return response()->json($build);
  }

  public function store(Request $request)
  {
    // Validation
    if(!$request->has('name') || trim($request->input('name')) == "") {
      return response()->json(["message" => "No name found in request", "success" => false], 400);
    }
    if(!$request->has('build') || count($request->input('build')) == 0) {
      return response()->json(["message" => "No champion data in request", "success" => false], 400);
    }

    $this->dbConnection->beginTransaction();
    try {
      // create build using name
      $this->dbConnection->insert('INSERT INTO Builds (name) VALUES (?)', [$request->get('name')]);
      $newBuildId = $this->dbConnection->select('SELECT last_insert_id() as id;')[0]->id;
      // Loop on build
      // for each iteration add the champ to ChampionBuild linking table and each item into ChampionBuildCompleted
      foreach ($request->get('build') as $champIndex => $champion) {
        $this->dbConnection->insert('INSERT INTO Champions_Builds (champion_id, build_id, `order`) VALUES (?, ?, ?)', [$champion["id"], $newBuildId, $champIndex]);
        $newChampionBuildId = $this->dbConnection->select('SELECT last_insert_id() as id;')[0]->id;
        foreach ($champion["items"] as $itemIndex => $item) {
          $this->dbConnection
               ->insert('INSERT INTO Champions_Builds_Completed (champion_build_id, completed_id, `order`) VALUES (?, ?, ?)', [$newChampionBuildId, $item, $itemIndex]);
        }
      }
    } catch (\Throwable $e) {
      $this->dbConnection->rollback();
      if($e->errorInfo[1] == 1062) {
        return response()->json(["message" => "Build name already exists"], 400);
      }
      return response()->json(["message" => "Something went wrong"], 500);
    }
    $this->dbConnection->commit();
    return response()->json(["message" => "Build successfully created", "success" => true, "newBuildId" => $newBuildId]);
  }

  public function update($id, Request $request)
  {
    // Validation
    if (!$request->has('instructions')) {
      return response()->json(["message" => "No instructions found", "success" => false], 400);
    }

    $this->dbConnection->beginTransaction();
    // Implement Instructions "API"
    try {
      foreach ($request->get('instructions') as $instruction) {
        $subject = '';
        // Check subject now since it is present in every type of request
        if (array_key_exists('subject', $instruction)) {
          $subject = $instruction['subject'];
          if ($subject != 'champion' && $subject != 'item' && $subject != 'name') {
            $this->dbConnection->rollback();
            return response()->json(["message" => "Invalid 'subject' found", "success" => false], 400);
          }
        } else {
          $this->dbConnection->rollback();
          return response()->json(["message" => "Instruction with no 'subject' found", "success" => false], 400);
        }
        if (array_key_exists('type', $instruction)) {
          if ($instruction['type'] == 'add') {
            if ($subject == 'champion') {
              // Check for index and id
              $this->checkIfPropsExistElseFail(['index', 'id'], $instruction);

              // Instruction implementation
              $this->dbConnection
                   ->insert('INSERT INTO Champions_Builds (champion_id, build_id, `order`) VALUES (?, ?, ?)', [$instruction["id"], $id, $instruction["index"]]);
            } else if ($subject == 'item') {
              // Check for champion, index and id
              $this->checkIfPropsExistElseFail(['champion', 'index', 'id'], $instruction);

              // Instruction implementation
              // Get champion cbid at order = instruction["champion"]
              $champ = $this->dbConnection
                            ->select('SELECT champion_build_id AS cbid FROM Champions_Builds WHERE build_id = ? AND `order` = ?', [$id, $instruction["champion"]]);
              $this->dbConnection
                   ->insert('INSERT INTO Champions_Builds_Completed (champion_build_id, completed_id, `order`) VALUES (?, ?, ?)',
                            [$champ[0]->cbid, $instruction["id"], $instruction["index"]]);
            } else {
              return response()->json(["message" => "Invalid 'subject' found in 'add' instruction", "success" => false], 400);
            }
          } else if ($instruction['type'] == 'remove') {
            if ($subject == 'champion') {
              // Check for cbid
              $this->checkIfPropsExistElseFail(['cbid'], $instruction);

              // Instruction implementation
              $this->dbConnection->delete('DELETE FROM Champions_Builds WHERE champion_build_id = ?', [$instruction["cbid"]]);
            } else if ($subject == 'item') {
              // Check for cbcid
              $this->checkIfPropsExistElseFail(['cbcid'], $instruction);

              // Instruction implementation
              $this->dbConnection->delete('DELETE FROM Champions_Builds_Completed WHERE champion_build_completed_id = ?', [$instruction["cbcid"]]);
            } else {
              return response()->json(["message" => "Invalid 'subject' found in 'remove' instruction", "success" => false], 400);
            }
          } else if ($instruction['type'] == 'change') {
            if ($subject == 'champion') {
              // Check for cbid and id
              $this->checkIfPropsExistElseFail(['cbid', 'id'], $instruction);

              // Instruction implementation
              $this->dbConnection->update('UPDATE Champions_Builds SET champion_id = ? WHERE champion_build_id = ?', [$instruction["id"], $instruction["cbid"]]);
            } else if ($subject == 'item') {
              // Check for cbcid and id
              $this->checkIfPropsExistElseFail(['cbcid', 'id'], $instruction);

              // Instruction implementation
              $this->dbConnection
                   ->update('UPDATE Champions_Builds_Completed SET completed_id = ? WHERE champion_build_completed_id = ?', [$instruction["id"], $instruction["cbcid"]]);
            } else if ($subject == 'name') {
              // Check for name
              $this->checkIfPropsExistElseFail(['name'], $instruction);

              // Instruction implementation
              $this->dbConnection->update('UPDATE Builds SET name = ? WHERE build_id = ?', [$instruction["name"], $id]);
            } else {
              return response()->json(["message" => "Invalid 'subject' found in 'change' instruction", "success" => false], 400);
            }
          } else {
            $this->dbConnection->rollback();
            return response()->json(["message" => "Invalid 'type' found", "success" => false], 400);
          }
        } else {
          $this->dbConnection->rollback();
          return response()->json(["message" => "Instruction with no 'type' found", "success" => false], 400);
        }
      }
    } catch (\Throwable $e) {
      $this->dbConnection->rollback();
      return response()->json(["message" => "Something went wrong"], 500);
    }
    $this->dbConnection->commit();
    return response()->json(["message" => "Build successfully edited", "success" => true]);
  }

  private function checkIfPropsExistElseFail($properties, $array) {
    foreach ($properties as $property) {
      if (!array_key_exists($property, $array)) {
        $this->dbConnection->rollback();
        return response()->json(["message" => "Instruction with no " . $property . " found", "success" => false], 400);
      }
    }
  }

  public function destroy($id)
  {
    try {
      $this->dbConnection->delete('DELETE FROM Builds WHERE build_id = ?', [$id]);
    } catch (\Throwable $e) {
      return response()->json(["message" => "Something went wrong", "success" => false], 500);
    }
    return response()->json(["message" => "Build successfully deleted", "success" => true]);
  }
}
