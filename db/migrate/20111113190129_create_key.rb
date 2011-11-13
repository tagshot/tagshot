class CreateKey < ActiveRecord::Migration
  def up
		create_table :keys do |c|
			c.string :name
		end
  end

  def down
		drop_table :keys
  end
end
