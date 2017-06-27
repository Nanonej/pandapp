require "rubygems"
require "sinatra/base"
require 'sinatra'
require 'haml'

class MyApp < Sinatra::Base

	set :port, 2020

	get '/' do
	  haml :index
	end

	get '*' do
	  'error 404'
	end

end
