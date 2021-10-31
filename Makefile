.PHONY: all help production rebuild-remote clean distclean dev pretend

-include .buildrc

help:
	@echo "Target                     | Explanation"
	@echo "production                 | Run a complete production build from scratch."
	@echo "rebuild-remote             | Rebuild the production site with no changes."
	@echo "release-notes              | Generate or refresh release notes from clickup"
	@echo "dev                        | alias for npx docusaurus run. Interactive dev environment"
	@echo "pretend                    | alias for npm docusaurus serve - serve a production build locally."
	@echo "world                      | distclean, production and then dev"
	@echo "clean                      | remove module cache and build directories"
	@echo "distclean                  | runs clean, and also removes .docusaurus and lockfiles"
	@echo "help                       | this help screen (and default if no other argument is given)"

all: help

production:
	@echo "Creating production build"
	npm install && npm run build || true

rebuild-remote:
ifndef NETLIFY_REBUILD_WEBHOOK
	@echo
	@echo "NETLIFY_REBUILD_WEBHOOK must be set to the correct URL in the enviornment."
	@echo "If you create a .buildrc file in the same directory as the Makefile with it defined, it will be included."
	@echo
	@echo "Try this:"
	@echo "    echo \"NETLIFY_REBUILD_WEBHOOK=https//url.to.webhook\" > .buildrc"
	@echo "    echo \".buildrc\" >> .gitignore"
	@echo 
	@echo "This makes sure the hook isn't shared or tracked, but keeps you from having to keep exporting it."
	@echo
	@exit 1
endif
	@curl -X POST -d '{}' ${NETLIFY_REBUILD_WEBHOOK} > /dev/null 2>&1
	@exit $?

clean:
	@echo "Clearing build cache ..."
	npx docusaurus clear

distclean: clean
	@echo "Removing package locks ..."
	rm -rf package-lock.json yarn.lock

dev:
	@echo "Creating Development Environment"
	npx docusaurus start

pretend:
	@echo "Launching Production Build Locally"
	npm docusaurus serve

world: distclean production dev
