require 'rack'
require 'rack/lobster'

class Shrimp

	SHRIMP_STRING = %(
		|///
		.*----__//
		<----/|/|/|
	)

	def initialize(successor)
		@successor = successor
	end

	def call(environment)
		puts SHRIMP_STRING
		status, headers, response = @successor.call(environment)

		response.write SHRIMP_STRING
		headers['Content-Type'] = 'text/plain'
		
		[status, headers, response]
	end
	
end

use Shrimp
run Rack::Lobster.new