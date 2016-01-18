require "/home/illia/Documents/patience/lib/middleware.rb"
require "rack"

app = Rack::Builder.new do
	use Middleware::Save
	use Middleware::Home
	run Middleware::Serve.new
end

run app