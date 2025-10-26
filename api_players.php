<?php

// ============================================
// VALORDLE - Player Names API
// ============================================

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

define('PLAYERS_FILE', __DIR__ . '/data/players.json');
define('WORDS_FILE', __DIR__ . '/data/words.json');

/**
 * Load players from JSON file
 */
function loadPlayers() {
    if (!file_exists(PLAYERS_FILE)) {
        return ['players' => []];
    }
    $content = file_get_contents(PLAYERS_FILE);
    return json_decode($content, true) ?? ['players' => []];
}

/**
 * Extract 5-letter player names
 */
function getValidPlayerNames() {
    $content = file_get_contents(PLAYERS_FILE);
    $playersData = json_decode($content, true);
    
    // Handle both array and object format
    $players = [];
    if (is_array($playersData)) {
        if (isset($playersData['players'])) {
            $players = $playersData['players'];
        } else {
            // Direct array format
            $players = $playersData;
        }
    }
    
    $validNames = [];
    
    foreach ($players as $player) {
        if (!is_array($player)) continue;
        
        $playerName = $player['player_name'] ?? '';
        
        // Convert to uppercase and check length
        $playerNameUpper = strtoupper($playerName);
        
        // Check if exactly 5 letters and only contains A-Z
        if (strlen($playerNameUpper) === 5 && preg_match('/^[A-Z]+$/', $playerNameUpper)) {
            if (!in_array($playerNameUpper, $validNames)) {
                $validNames[] = $playerNameUpper;
            }
        }
    }
    
    sort($validNames);
    return $validNames;
}

/**
 * Load words from JSON file
 */
function loadWords() {
    if (!file_exists(WORDS_FILE)) {
        return ['words' => []];
    }
    $content = file_get_contents(WORDS_FILE);
    return json_decode($content, true) ?? ['words' => []];
}

/**
 * Send JSON response
 */
function sendResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit;
}

/**
 * Get day number for daily word calculation
 */
function getDayNumber() {
    $start = new DateTime('2024-01-01');
    $today = new DateTime('now');
    $diff = $today->diff($start);
    return $diff->days;
}

// ============================================
// Route Handling
// ============================================

$action = $_GET['action'] ?? $_POST['action'] ?? null;
$method = $_SERVER['REQUEST_METHOD'];

if ($action === 'player-names' && $method === 'GET') {
    // GET /api_players.php?action=player-names
    $validNames = getValidPlayerNames();
    sendResponse([
        'playerNames' => $validNames,
        'count' => count($validNames)
    ]);
}

elseif ($action === 'daily-player-word' && $method === 'GET') {
    // GET /api_players.php?action=daily-player-word
    $validNames = getValidPlayerNames();
    
    if (empty($validNames)) {
        sendResponse(['error' => 'No valid player names available'], 400);
    }
    
    $dayNumber = getDayNumber();
    $index = $dayNumber % count($validNames);
    $dailyWord = $validNames[$index];
    
    sendResponse([
        'dailyWord' => $dailyWord,
        'dayNumber' => $dayNumber,
        'totalWords' => count($validNames),
        'type' => 'player'
    ]);
}

elseif ($action === 'all-names' && $method === 'GET') {
    // GET /api_players.php?action=all-names
    // Combined: Valorant terms + Player names
    $words = loadWords()['words'] ?? [];
    $playerNames = getValidPlayerNames();
    
    $allNames = array_unique(array_merge($words, $playerNames));
    sort($allNames);
    
    sendResponse([
        'allNames' => $allNames,
        'count' => count($allNames),
        'wordCount' => count($words),
        'playerCount' => count($playerNames)
    ]);
}

elseif ($action === 'daily-word' && $method === 'GET') {
    // GET /api_players.php?action=daily-word
    // Daily word from combined list
    $words = loadWords()['words'] ?? [];
    $playerNames = getValidPlayerNames();
    
    $allNames = array_unique(array_merge($words, $playerNames));
    sort($allNames);
    
    if (empty($allNames)) {
        sendResponse(['error' => 'No words available'], 400);
    }
    
    $dayNumber = getDayNumber();
    $index = $dayNumber % count($allNames);
    $dailyWord = $allNames[$index];
    
    // Check if it's a player or a word
    $type = in_array($dailyWord, $playerNames) ? 'player' : 'word';
    
    sendResponse([
        'dailyWord' => $dailyWord,
        'dayNumber' => $dayNumber,
        'totalWords' => count($allNames),
        'type' => $type
    ]);
}

else {
    sendResponse(['error' => 'Invalid action'], 400);
}

?>
