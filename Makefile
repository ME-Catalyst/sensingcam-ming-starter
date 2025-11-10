# The Makefile wraps docker compose commands so contributors do not have to
# memorize the exact compose flags used by the project.
SHELL := /bin/bash

.DEFAULT_GOAL := help

DOCKER_COMPOSE ?= docker compose
COMPOSE_FILE ?= src/docker-compose.yml

# COMPOSE_CMD centralizes the invocation so individual targets remain concise.
COMPOSE_CMD = $(DOCKER_COMPOSE) -f $(COMPOSE_FILE)

.PHONY: help up down logs verify seed lint test checks

help:
	@echo "Available targets:"
	@echo "  make up       - Start the MING + Frigate stack (via $(COMPOSE_FILE))"
	@echo "  make down     - Stop the stack"
	@echo "  make logs     - Tail logs from all services"
	@echo "  make verify   - Run scripts/verify_stack.sh"
	@echo "  make lint     - Run YAML + shell linters"
	@echo "  make test     - Run compose health checks"
	@echo "  make checks   - Run linting and compose validation"
	@echo "  make seed     - Seed InfluxDB with example data"

up:
	$(COMPOSE_CMD) up -d

up-build:
	$(COMPOSE_CMD) up -d --build

down:
	$(COMPOSE_CMD) down

logs:
	$(COMPOSE_CMD) logs -f

verify:
	bash scripts/verify_stack.sh

seed:
	bash scripts/seed_influx_bucket.sh

lint:
	bash tests/lint.sh

test:
	bash tests/test_compose_stack.sh

checks: lint test
