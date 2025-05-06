<?php
/*
Template Name: Rainbow Game
Citation: WordPress Developer Resources. (n.d.). Page Template Files. Retrieved April 2025, from https://developer.wordpress.org/themes/template-files-section/page-template-files/
*/


get_header(); ?>

<div style="padding: 20px; margin: auto;">
    <?php
    $game_file = ABSPATH . 'wp-content/Rainbow/index.html';

    if (file_exists($game_file)) {
        include($game_file);
        echo '<link rel="stylesheet" href="/wp-content/Rainbow/styles.css">';
        echo '<script src="/wp-content/Rainbow/script.js"></script>';
    } else {
        echo '<p style="color:red;">Game file not found: ' . $game_file . '</p>';
    }
    ?>
</div>

<?php get_footer(); ?>
