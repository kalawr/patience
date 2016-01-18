require 'net/smtp'

message = %/
From: Ruby User <me@gromdomain.com>
To: Mr. Kalaur <kallaur125@gmail.com>
Subject: Your Newly Acquired Power

Hi, sawsai.
/

Net::SMTP.start('localhost') do |smtp|
	smtp.send_message message, 'me@gromdomain.com', 'kallaur125@gmail.com' 
end