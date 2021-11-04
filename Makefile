.PHONY: all help production rebuild-remote clean distclean dev debug world

-include .buildrc

help:
	@echo "Target              | Explanation"
	@echo "------------------- + ------------------------------------------------------------------"
	@echo "production          | Run a complete production build from scratch."
	@echo "rebuild-remote      | Rebuild the production site with no changes."
	@echo "release-notes       | Generate or refresh release notes from clickup"
	@echo "dev                 | alias for npx docusaurus run. Interactive dev environment"
	@echo "debug               | open a browser window to the docusaurus state explorer" 
	@echo "                    | (requires devinstance running)"
	@echo "pretend             | alias for npm docusaurus serve - serve a production build locally."
	@echo "world               | distclean, production and then dev"
	@echo "clean               | remove module cache and build directories"
	@echo "distclean           | runs clean, and also removes .docusaurus and lockfiles"
	@echo "maintainer-clean    | removes *all* untracked files, even if ignored by .gitignore."
	@echo "                    | Use carefully!"
	@echo "help                | this help screen (and default if no other argument is given)"

all: help

production:
	@echo "Creating production build"
	npm install --legacy-peer-deps && npm run build || true

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

maintainer-clean-check:
	@git clean -nfdx
	@echo -n "Are you sure? [y/N] " && read ans && [ $${ans:-N} = y ]

maintainer-clean: maintainer-clean-check
	@echo "Removing all untracked files (pausing for five seconds in case you didn't mean it) ..."
	sleep 5
	git clean -fdx
	
dev:
	@echo "Creating Development Environment"
	npx docusaurus start

debug:
	@echo "Opening Docusaurus Global Explorer"
	open http://localhost:3000/__docusaurus/debug

pretend:
	@echo "Launching Production Build Locally"
	npm docusaurus serve

release-notes:
ifndef SWIMM_RELEASE_NAME
	@echo "You neeed to specify a release name."
	@echo "Try: make release-notes SWIMM_RELEASE_NAME=0.1.2 or 0.1.2-3 or even 0.1.2.3 (pick one of those)"
	@exit 1
endif
	@echo "Did you hear about what happened in Roswell?"
	scripts/swimm-releases.js --release=${SWIMM_RELEASE_NAME}

world: distclean production dev
