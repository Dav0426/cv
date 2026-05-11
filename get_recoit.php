<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Réception GET</title>
</head>
<body>

<?php
if (isset($_GET["prenom"]) && isset($_GET["repeter"])) {

    $prenom = $_GET["prenom"];
    $repeter = (int) $_GET["repeter"];

    if ($prenom !== "" && $repeter >= 1 && $repeter <= 100) {

        $double = $repeter * 2;

        echo "<p>Double : " . $double . "</p>";

        for ($i = 0; $i < $double; $i++) {
            echo "<p>Bonjour " . htmlspecialchars($prenom) . " !</p>";
        }

    } else {
        echo "<p>Erreur : le prénom ne doit pas être vide et le nombre doit être compris entre 1 et 100.</p>";
    }

} else {
    echo "<p>Erreur : il manque une donnée dans l'URL.</p>";
}
?>

</body>
</html>