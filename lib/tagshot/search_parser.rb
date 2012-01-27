
module Tagshot
  class SearchParser
    def initialize(query, string)
      @query   = query
      @string  = string
    end

    def convert
      orBlocks = @string.split(',')
      options = []
      orBlocks.map! do |block|
        queryBlocks = []
        block.split('+').each do |condition|
          if condition =~ /(.+):(.*)/
	    qMethode = "q_#$1"
            if respond_to? qMethode
	      query, *args = send qMethode, $2
              queryBlocks << query
              options += args
              next
	    end
          end
	  queryBlocks << 'photos.id IN (SELECT photo_id FROM photos_tags
	              WHERE photos_tags.tag_id IN ( select id from tags where name = ?))'
	  options << condition
	end
	'(' + queryBlocks.join(' AND ') + ')'
      end
      sql = orBlocks.join(') OR (')
      @query.joins(:photo_data).where('('+sql+')', *options)
    end

    def q_after(string)
      [ 'photo_data.date > ?', string ]
    end

    def q_before(string)
      [ 'photo_data.date < ?', string ]
    end
  end
end
