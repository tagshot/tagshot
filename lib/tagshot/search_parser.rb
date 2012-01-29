
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
      @query.joins(:photo_data, :source).where('('+sql+')', *options)
    end

    def q_date(string)
      if string =~ /(>|>=|=|<=|<|)([0-9]{4})(-[0-9]{2})?(-[0-9]{2})?/
        opt = $1 == '' ? '=' : $1
        year = $2
        month = $3 == '' ? '-01' : $3
        day = $4 == '' ? '-01' : $4
        return [ "photo_data.date #{opt} \"#{year}#{month}#{day}\"" ]
      end
      raise 'no valid stars query'
    end

    def q_stars(string)
      if string =~ /(>|>=|=|<=|<|)([0-5])/
        opt = $1 == '' ? '=' : $1
        return [ "photo_data.rating #{opt} #{$2}" ]
      end
      raise 'no valid stars query'
    end

    def q_year(string)
      if string =~ /(>|>=|=|<=|<|)([0-9]{4})/
        opt = $1 == '' ? '=' : $1
        return [ "sources.year #{opt} #{$2}" ]
      end
      raise 'no valid year query'
    end
  end
end
