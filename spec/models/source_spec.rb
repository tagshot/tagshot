require 'spec_helper'

describe Source do
  let(:source) { Factory(:source) }
  
  it { source.should_not accept_values_for(:path, "", nil) }
  it { source.should_not accept_values_for(:name, "", nil) }
  
  it 'should accept a non existent path' do
    source.path = '/path/that/does/not/exists'
    source.should be_valid
  end
end
