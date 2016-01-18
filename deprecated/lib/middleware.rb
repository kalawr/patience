require 'rack'

module Middleware

	# tranforms '/' into '/index.html'
	class Home 

		def initialize(successor = nil)
			@successor = successor
		end

		def call(env)
			env['PATH_INFO'] = '/index.html' if env['PATH_INFO'] == '/'
			
			@successor.call(env)
		end

	end

	# fetches files
	class Serve

		def initialize(successor = nil)
			@successor = successor
			@root      = '/home/illia/Documents/patience/public/'
		end 

		def call(env)
			Rack::File.new( @root ).call( env )
		end
	end

	# if POSTed, saves files to DB, redirects to success page
	class Save

		def initialize(successor = nil)
			@successor = successor
			@data      = 'db/test'
		end

		def call(env)
			request = Rack::Request.new(env)
			puts request['mail']

			if request.post?
				File.open( @data, 'a' ) do |f|
					f.write "\n#{request['mail']}:#{request['picks']}"
				end
			end

			@successor.call(env)
		end

	end
end