require 'sinatra'
require 'haml'

set :port, 2020

get '/' do
  haml :index
end

get '*' do
  'error 404'
end
