<?php
header('Content-Type: application/json');
require_once 'config.php';

if (!isset($_POST['email']) || empty($_POST['email'])) {
    echo json_encode(['success' => false, 'message' => 'Email requis.']);
    exit;
}

$email = trim($_POST['email']);

try {
    // Vérifier si le visiteur existe
    $stmt = $pdo->prepare("SELECT id FROM visiteurs WHERE email = ?");
    $stmt->execute([$email]);
    $visiteur = $stmt->fetch();

    if (!$visiteur) {
        echo json_encode(['success' => false, 'message' => 'Visiteur non trouvé.']);
        exit;
    }

    $visiteur_id = $visiteur['id'];

    // Enregistrement de la sortie
    $stmt = $pdo->prepare("INSERT INTO visites (visiteur_id, type, objet) VALUES (?, 'sortie', '')");
    $stmt->execute([$visiteur_id]);

    echo json_encode(['success' => true, 'message' => 'Sortie enregistrée avec succès !']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur : ' . $e->getMessage()]);
}
