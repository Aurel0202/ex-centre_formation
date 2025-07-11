<?php
require_once '../config.php';
header('Content-Type: application/json');

$stmt = $pdo->query("
  SELECT v.id, v.nom, v.prenom
  FROM visiteurs v
  JOIN visites vi ON vi.visiteur_id = v.id
  WHERE vi.type = 'entree'
    AND v.id NOT IN (
      SELECT visiteur_id FROM visites WHERE type = 'sortie'
    )
  ORDER BY v.nom
");
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
