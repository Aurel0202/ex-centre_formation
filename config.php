<?php
$host = 'localhost';
$dbname = 'centre_formation';
$user = 'root';
$password = ''; // Mets 'root' si tu es sur MAMP Mac

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "✅ Connexion réussie à la base de données !";
} catch (PDOException $e) {
    die("❌ Erreur de connexion : " . $e->getMessage());
}
