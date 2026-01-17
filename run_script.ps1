# run_script.ps1

# Path to your venv
$venv = "C:\Users\fasho\PycharmProjects\EUSoverignDataPlatform\venv"

# Activate venv
$activate = Join-Path $venv "Scripts\Activate.ps1"
Write-Host "Activating venv..."
& $activate

# Path to your Python script
$script = "C:\Users\fasho\PycharmProjects\EUSoverignDataPlatform\local_model.py"
Write-Host "Running Python script..."
python $script

Read-Host "Press Enter to exit"
