Jekyll::Hooks.register :site, :post_read do |site|
  Jekyll.logger.debug "Site Post-Read Hooks: build-search-js"

  # install node modules
  system("npm install")

  # get elasticsearch URL
  es = site.config['elasticsearch']
  url = es ? (es['readonly_url'] ? es['readonly_url'] : "") : ""

  # build search.js
  system("webpack --env ELASTICSEARCH_URL=" << url)
end
