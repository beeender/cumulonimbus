<?php
/*
   Plugin Name: TagBoard
   Plugin URI: 
   Description: 
   Version: 0.00
   Author: Chen Mulong
   Author URI: 

   Copyright 2012, Chen Mulong

   This program is free software: you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation, either version 3 of the License, or
   (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

function tagboard_widget_control()
{ 
    $default_options['title'] = '';
    $default_options['width'] = 120;
    $default_options['height'] = 120;

    $options = get_option('tagboard_options', $default_options);

    if($options == $default_options)
    { 
        add_option('tagboard_options', $options, ' ', 'no');
    }

    if ($_POST["tagboard_widget_submit"] ) 
    {
        $newopts['title'] = strip_tags(stripslashes($_POST['tagboard_widget_title']));
        $newopts['width'] = strip_tags(stripslashes($_POST['tagboard_widget_width']));
        $newopts['height'] = strip_tags(stripslashes($_POST['tagboard_widget_height']));
        if($options != $newopts)
        { 
            $options = $newopts;
            update_option('tagboard_options', $options);
        }
    }

    $title = attribute_escape($options['title']);
    $width = attribute_escape($options['width']);
    $height = attribute_escape($options['height']);

    ?>
        <p><label for="tagboard_widget_title"><?php _e('Title:'); ?> <input class="widefat" id="tagboard_widget_title" name="tagboard_widget_title" type="text" value="<?php echo $title; ?>" /></label></p>
        <p><label for="tagboard_widget_width"><?php _e('Width:'); ?> <input class="widefat" id="tagboard_widget_width" name="tagboard_widget_width" type="text" value="<?php echo $width; ?>" /></label></p>
        <p><label for="tagboard_widget_height"><?php _e('height:'); ?> <input class="widefat" id="tagboard_widget_height" name="tagboard_widget_height" type="text" value="<?php echo $height; ?>" /></label></p>
        <input type="hidden" id="tagboard_widget_submit" name="tagboard_widget_submit" value="1" />
        <?php
}

function tagboar_widget($args)
{ 
    $max_tags = 50;
    $plugin_path = plugins_url('tagboard/');
    $tags = get_tags(array('orderby' => 'count', 'order' => 'DESC'));

    $options = get_option('tagboard_options');
    $width = $options['width'];
    $height = $options['height'];

    echo "<script src='".$plugin_path."tagboard.js' type='text/javascript'></script>";
    echo "<script src='".$plugin_path."sphereboard.js' type='text/javascript'></script>";
    echo "<canvas id='myCanvas' width=$width height=$height></canvas>";
    echo "<script type = 'text/javascript'>";
    foreach ($tags as $tag)
    { 
        $tag_link = get_tag_link($tag->term_id);
        echo "addTag(\"$tag->name\", \"$tag_link\");\n";
        $max_tags -= 1;
        if($max_tags <= 0)
        { 
            break;
        }
    }
    echo "window.onload = start;";
    echo "</script>";
}

function init_tagboard_widget()
{ 
    wp_register_sidebar_widget("TagBoard", "TagBoard", tagboar_widget);
    wp_register_widget_control("TagBoard", "TagBoard", tagboard_widget_control);
}

// Delay plugin execution until sidebar is loaded
add_action('widgets_init', 'init_tagboard_widget');

?>
