<?php
header('Content-Type: application/json');
require_once 'config.php';

if (!isset($_POST['nom'], $_POST['prenom'], $_POST['email'], $_POST['objet'])) {
    echo json_encode(['success' => false, 'message' => 'Champs manquants']);
    exit;
}

$nom = trim($_POST['nom']);
$prenom = trim($_POST['prenom']);
$email = trim($_POST['email']);
$objet = $_POST['objet'];
$personnel_id = $_POST['personnel_id'] ?? null;
$formation_id = $_POST['formation_id'] ?? null;

try {
    // Vérifie si le visiteur existe
    $stmt = $pdo->prepare("SELECT id FROM visiteurs WHERE email = ?");
    $stmt->execute([$email]);
    $visiteur = $stmt->fetch();

    if (!$visiteur) {
        $stmt = $pdo->prepare("INSERT INTO visiteurs (nom, prenom, email) VALUES (?, ?, ?)");
        $stmt->execute([$nom, $prenom, $email]);
        $visiteur_id = $pdo->lastInsertId();
    } else {
        $visiteur_id = $visiteur['id'];
    }

    // Enregistrer la visite
    $stmt = $pdo->prepare("
        INSERT INTO visites (visiteur_id, type, objet, personnel_id, formation_id)
        VALUES (?, 'entree', ?, ?, ?)
    ");
    $stmt->execute([$visiteur_id, $objet, $personnel_id, $formation_id]);

    echo json_encode(['success' => true, 'message' => 'Enregistrement réussi !']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erreur BDD : ' . $e->getMessage()]);
}
?>
