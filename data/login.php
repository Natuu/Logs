<?php

$mdp = file_get_contents('php://input');


if ($mdp == '123')
{
	echo 'true';
}
else
{
	echo 'false';
}