
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
            if response_to? qMethode
	      queryBlocks.append(send_to qMethode $2)
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
      @query.where('('+sql+')', *options)
    end
  end
end
