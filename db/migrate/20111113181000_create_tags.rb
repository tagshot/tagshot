class CreateTags < ActiveRecord::Migration
  def up
	create_table :tags do |c|		# create columns
	  c.string :name	# id automatisch
	end
  end

  def down
	drop_table :tags
  end
end
