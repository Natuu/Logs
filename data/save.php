<?php

$data = file_get_contents('php://input');

if($data != null)
{
	file_put_contents("data.json", $data);
}

echo $data;