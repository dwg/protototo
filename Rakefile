require 'rake'

DIALOGS_ROOT     = File.expand_path(File.dirname(__FILE__))
DIALOGS_SRC_DIR  = File.join(DIALOGS_ROOT, 'src')
DIALOGS_DIST_DIR = File.join(DIALOGS_ROOT, 'dist')
DIALOGS_VERSION  = '0.1'

task :default => :dist

desc "Builds the distribution."
task :dist do
  $:.unshift File.join(DIALOGS_ROOT, 'lib')
  require 'protodoc'
  
  Dir.chdir(DIALOGS_SRC_DIR) do
    File.open(File.join(DIALOGS_DIST_DIR, 'dialogs.js'), 'w+') do |dist|
      dist << Protodoc::Preprocessor.new('dialogs.js')
    end
  end
end