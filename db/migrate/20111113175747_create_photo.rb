class CreatePhoto < ActiveRecord::Migration
  def up
		create_table :photos do |c|		# create columns
			c.string :file	# id automatisch
			c.string :name
		end
  end

  def down
	drop_table :photos
  end
end
