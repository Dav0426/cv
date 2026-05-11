<?php
// inscription.php
session_start();
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Inscription</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

<main class="form-page">
    <section class="form-card">
        <h1>Inscription</h1>

        <?php
        if (isset($_GET['erreur'])) {

            if ($_GET['erreur'] === "mdp") {
                echo "<p class='erreur'>Les mots de passe ne correspondent pas.</p>";
            }

            if ($_GET['erreur'] === "login") {
                echo "<p class='erreur'>Cet Identifiant existe déjà.</p>";
            }
        }
        ?>

        <form action="traitement_inscription.php" method="post">
            <label for="prenom">Prénom</label>
            <input type="text" id="prenom" name="prenom" required>

            <label for="nom">Nom</label>
            <input type="text" id="nom" name="nom" required>

            <label for="login">Identifiant</label>
            <input type="text" id="login" name="login" required>

            <label for="password">Mot de passe</label>
            <input type="password" id="password" name="password" required>

            <label for="confirmation">Confirmation du mot de passe</label>
            <input type="password" id="confirmation" name="confirmation" required>

            <button type="submit">Créer mon compte</button>
        </form>

        <p>
            Déjà inscrit ?
            <a href="login.php">Se connecter</a>
        </p>
    </section>
</main>

</body>
</html>