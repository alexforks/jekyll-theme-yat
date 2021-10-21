Jekyll::Hooks.register :site, :after_init do |site|
  build_js()
end

def build_js()

  system("pwd && ls -l")

  # install node modules
  system("npm install")

  # build search.js
  system("webpack")

end
