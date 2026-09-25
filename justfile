set windows-shell := ["powershell.exe", "-NoLogo", "-Command"]

system-info:
  @echo "This is an {{os_family()}} ({{arch()}}) machine."

bundle-command := if os_family() == "windows" {
  "powershell -ExecutionPolicy Bypass -File bundle.ps1"
} else {
  "bash ./bundle.sh"
}

bundle name="minimal":
  {{bundle-command}} {{name}}

run name="minimal": (bundle name)
  mystral run bundle-{{name}}.js