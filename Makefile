.PHONY: all help production rebuild-remote clean distclean dev

help:
	@echo "Target                     | Explanation"
	@echo "production                 | Run a complete production build from scratch."
	@echo "rebuild-remote             | Rebuild the production site with no changes."
	@echo "release-notes              | Generate or refresh release notes from clickup"
	@echo "dev                        | alias for npx docusaurus run"
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
	@echo "NETLIFY_REBUILD_WEBHOOK must be set to the correct URL in the enviornment."
	@echo "Try 'export NETLIFY_REBUILD_WEBHOOK=https://url.to.webhook' and run again."
	@exit 1
endif
	@curl -X POST -d '{}' ${NETLIFY_REBUILD_WEBHOOK} > /dev/null 2>&1
	@exit $?

clean:
	@echo "Removing module cache & build directory"
	rm -rf node_modules build

distclean: clean
	@echo "Removing .docusaurus instance and package locks"
	rm -rf .docusaurus package-lock.json yarn.lock

release-notes:
	@echo Coming Soon ...

dev:
	@echo "Creating Development Environment"
	npx docusaurus start

world: distclean production dev
