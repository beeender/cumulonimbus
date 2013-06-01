<?php
/*
   Plugin Name: Cumulonimbus
   Plugin URI: https://github.com/beeender/cumulonimbus
   Description: Cumulonimbus allows you to display your site's tags on the surface of a rotating sphere.
   Version: 0.10
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

function get_cumulonimbus_options()
{
    $default_options['title'] = '';
    $default_options['width'] = 120;
    $default_options['height'] = 120;
    $default_options['max_font_size'] = 14;
    $default_options['bgcolor'] = "FFFFFF";
    $default_options['max_tags'] = 45;
    $default_options['bg_transparency'] = 'true';

    $options  = get_option('cumulonimbus_options', $default_options);
    if($options == $default_options)
    {
        add_option('cumulonimbus_options', $options, ' ', 'no');
    }

    return $options;
}

function cumulonimbus_widget_control()
{

    $options = get_cumulonimbus_options();

    if ($_POST["cumulonimbus_widget_submit"] )
    {
        $newopts['title'] = strip_tags(stripslashes($_POST['cumulonimbus_widget_title']));
        $newopts['width'] = strip_tags(stripslashes($_POST['cumulonimbus_widget_width']));
        $newopts['height'] = strip_tags(stripslashes($_POST['cumulonimbus_widget_height']));
        $newopts['max_font_size'] = strip_tags(stripslashes($_POST['cumulonimbus_widget_max_font_size']));
        $newopts['bgcolor'] = strip_tags(stripslashes($_POST['cumulonimbus_widget_bgcolor']));
        $newopts['max_tags'] = strip_tags(stripslashes($_POST['cumulonimbus_widget_maxtags']));
        $newopts['bg_transparency'] = strip_tags(stripslashes($_POST['cumulonimbus_widget_bgtran']));

        if(strlen($newopts['title']) > 50)
        {
            $newopts['title'] = $options['title'];
        }

        if(!ctype_digit($newopts['width']) ||
            strlen($newopts['width']) > 4)
        {
            $newopts['width'] = $options['width'];
        }

        if(!ctype_digit($newopts['height']) ||
            strlen($newopts['height']) > 4)
        {
            $newopts['height'] = $options['height'];
        }

        if(!ctype_digit($newopts['max_font_size']) ||
            strlen($newopts['max_font_size']) > 2)
        {
            $newopts['max_font_size'] = $options['max_font_size'];
        }

        if(!ctype_xdigit($newopts['bgcolor']) ||
            strlen($newopts['bgcolor']) > 6)
        { //Drop invalid color input
            $newopts['bgcolor'] = $options['bgcolor'];
        }

        if(!ctype_digit($newopts['max_tags']) ||
            strlen($newopts['max_tags']) > 3)
        {
            $newopts['max_tags'] = $options['max_tags'];
        }

        if($newopts['bg_transparency'] != 'true')
        {
            $newopts['bg_transparency'] = 'false';
        }

        if($options != $newopts)
        {
            $options = $newopts;
            update_option('cumulonimbus_options', $options);
        }
    }

    $title = attribute_escape($options['title']);
    $width = attribute_escape($options['width']);
    $height = attribute_escape($options['height']);
    $max_font_size = attribute_escape($options['max_font_size']);
    $bgcolor = attribute_escape($options['bgcolor']);
    $max_tags = attribute_escape($options['max_tags']);
    $bg_transparency = attribute_escape($options['bg_transparency']);

?>
        <p><label for="cumulonimbus_widget_title"><?php _e('Title:'); ?> <input class="widefat" id="cumulonimbus_widget_title" name="cumulonimbus_widget_title" type="text" value="<?php echo $title; ?>" /></label></p>
        <p><label for="cumulonimbus_widget_width"><?php _e('Width:'); ?> <input class="widefat" id="cumulonimbus_widget_width" name="cumulonimbus_widget_width" type="text" value="<?php echo $width; ?>" /></label></p>
        <p><label for="cumulonimbus_widget_height"><?php _e('Height:'); ?> <input class="widefat" id="cumulonimbus_widget_height" name="cumulonimbus_widget_height" type="text" value="<?php echo $height; ?>" /></label></p>
        <p><label for="cumulonimbus_widget_max_font_size"><?php _e('Max font size:'); ?> <input class="widefat" id="cumulonimbus_widget_max_font_size" name="cumulonimbus_widget_max_font_size" type="text" value="<?php echo $max_font_size; ?>" /></label></p>
        <p><label for="cumulonimbus_widget_bgcolor"><?php _e('Background color:'); ?> <input class="widefat" id="cumulonimbus_widget_bgcolor" name="cumulonimbus_widget_bgcolor" type="text" value="<?php echo $bgcolor; ?>" /></label></p>
        <p><label for="cumulonimbus_widget_maxtags"><?php _e('Max number of tags:'); ?> <input class="widefat" id="cumulonimbus_widget_maxtags" name="cumulonimbus_widget_maxtags" type="text" value="<?php echo $max_tags; ?>" /></label></p>
        <p><label for="cumulonimbus_widget_bgtran"> <input class="widefat" id="cumulonimbus_widget_bgtran" name="cumulonimbus_widget_bgtran" type="checkbox" value="true"<?php if( $bg_transparency == "true" ){ echo ' checked="checked"';} ?>" /> <?php _e('Background transparency'); ?> </label></p>
        <input type="hidden" id="cumulonimbus_widget_submit" name="cumulonimbus_widget_submit" value="1" />
<?php
}

function cumulonibus_widget($args)
{
    extract($args);
    $options = get_option('cumulonimbus_options');

    $max_tags = $options['max_tags'];
    $plugin_path = plugins_url('cumulonimbus/');
    $tags = get_tags(array('orderby' => 'count', 'order' => 'DESC'));

    $width = $options['width'];
    $height = $options['height'];

    echo $before_widget;
    echo "<script src='".$plugin_path."tagboard.js' type='text/javascript'></script>\n";
    echo "<script src='".$plugin_path."sphereboard.js' type='text/javascript'></script>\n";
    if( !empty($options['title']) )
    {
        echo $before_title . $options['title'] . $after_title . "\n";
    }
    echo "<div id='tagcloud' style='display:none'>\n";
    wp_tag_cloud();
    echo "</div>\n";
    echo "<canvas id='cumulonimbusCanvas' width=$width height=$height></canvas>\n";
    echo "<script type = 'text/javascript'>\n";
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
    echo "var opts = new Options();";
    echo "opts.bgcolor = \"#".$options['bgcolor']."\";";
    echo "opts.transparency = ".$options['bg_transparency'].";";
    echo "opts.max_font_size= ".$options['max_font_size'].";";
    echo "createTagBoard('sphere', opts);";
    echo "start();";
    echo "\n";
    echo "</script>\n";
    echo $after_widget;
}

function init_cumulonimbus_widget()
{
    register_sidebar_widget("Cumulonimbus", cumulonibus_widget);
    register_widget_control("Cumulonimbus", cumulonimbus_widget_control);
}

// Delay plugin execution until sidebar is loaded
add_action('widgets_init', 'init_cumulonimbus_widget');

?>
