require 'rake'

DIALOGS_ROOT     = File.expand_path(File.dirname(__FILE__))
DIALOGS_SRC_DIR  = File.join(DIALOGS_ROOT, 'src')
DIALOGS_DIST_DIR = File.join(DIALOGS_ROOT, 'dist')
DIALOGS_VERSION  = '0.1'

$:.unshift File.join(DIALOGS_ROOT, 'vendor', 'sprockets', 'lib')

task :default => :dist

def sprocketize path, source, destination=source
  begin
    require 'sprockets'
  rescue LoadError => e
    puts "\nYou'll need Sprockets to build Dialogs. Just run:\n\n"
    puts "  $ git submodule init"
    puts "  $ git submodule update"
    puts "\nand you should be all set.\n\n"
  end
  
  secretary = Sprockets::Secretary.new(
    :root => File.join(DIALOGS_ROOT, path),
    :load_path => [DIALOGS_SRC_DIR],
    :source_files => [source]
  )
  
  secretary.concatenation.save_to(File.join(DIALOGS_DIST_DIR, destination))
end

desc "Builds the distribution."
task :dist do
  sprocketize('src', 'dialogs.js')
end