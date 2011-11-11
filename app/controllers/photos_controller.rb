class PhotosController < ApplicationController
  
  def index
    @photos = [{
      :id => 42,
	    :exif => {
		    :date => "today",
		    :author => "",
		    :model => "",
		    :bla => ""
		  },
	    :iptc => {
		    :stars => {
			    :nr => 4,
			    :of => 5
		    },
		    :tags => ["hasso", "plattner", "sommer", "absolventen feier", "#public"]
	    },
	    :url => "",
	    :annotations => [{
		    "note" => "tolles licht",
		    "x" => 10,
		    "y" => 10,
		    "h" => 20,
		    "w" => 30
	    },
	    {
		    "note" => "wow",
		    "x" => 50,
	      "y" => 10,
	      "h" => 40, 
	      "w" => 10
	    }],
	    :thumb => "images/photo1.jpg"
    },{
      :id => 45,
	    :exif => {
		    :date => "today",
		    :author => "",
		    :model => "",
		    :bla => ""
		  },
	    :iptc => {
		    :stars => {
			    :nr => 4,
			    :of => 5
		    },
		    :tags => ["hasso", "plattner", "sommer", "absolventen feier", "#public"]
	    },
	    :url => "",
	    :annotations => [{
		    "note" => "tolles licht",
		    "x" => 10,
		    "y" => 10,
		    "h" => 20,
		    "w" => 30
	    },
	    {
		    "note" => "wow",
		    "x" => 50,
	      "y" => 10,
	      "h" => 40, 
	      "w" => 10
	    }],
	    :thumb => "images/photo2.jpg"
    },{
      :id => 83,
	    :exif => {
		    :date => "today",
		    :author => "",
		    :model => "",
		    :bla => ""
		  },
	    :iptc => {
		    :stars => {
			    :nr => 4,
			    :of => 5
		    },
		    :tags => ["hasso", "plattner", "sommer", "absolventen feier", "#public"]
	    },
	    :url => "",
	    :annotations => [{
		    "note" => "tolles licht",
		    "x" => 10,
		    "y" => 10,
		    "h" => 20,
		    "w" => 30
	    },
	    {
		    "note" => "wow",
		    "x" => 50,
	      "y" => 10,
	      "h" => 40, 
	      "w" => 10
	    }],
	    :thumb => "images/photo3.jpg"
    },{
      :id => 97,
	    :exif => {
		    :date => "today",
		    :author => "",
		    :model => "",
		    :bla => ""
		  },
	    :iptc => {
		    :stars => {
			    :nr => 4,
			    :of => 5
		    },
		    :tags => ["hasso", "plattner", "sommer", "absolventen feier", "#public"]
	    },
	    :url => "",
	    :annotations => [{
		    "note" => "tolles licht",
		    "x" => 10,
		    "y" => 10,
		    "h" => 20,
		    "w" => 30
	    },
	    {
		    "note" => "wow",
		    "x" => 50,
	      "y" => 10,
	      "h" => 40, 
	      "w" => 10
	    }],
	    :thumb => "images/photo1.jpg"
    }]
    
    respond_to do |format|
      format.html
      format.json { render :json => @photos }
    end
  end
end
