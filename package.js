Package.describe({
  name: "andrewaxelrod:gatorJs",
  summary: "Angular Style Form Validator for Vanilla Javascript. No Angular. No Jquery. Under 10kb.",
  version: "0.0.1",
  git: "https://github.com/andrewaxelrod/gator.js"
});

Package.onUse(function(api) {
  api.addFiles("dist/gator.min.js", "client");
});
