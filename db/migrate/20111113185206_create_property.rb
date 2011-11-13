class CreateProperty < ActiveRecord::Migration
  def up
		create_table :properties do |c|
			c.string :value
  	end
	end

def down
	drop_table :properties
end
end
