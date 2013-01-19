<?php
//header('Content-type: application/json');
echo json_encode(array_merge(array('error'=>$error), $data));
?>