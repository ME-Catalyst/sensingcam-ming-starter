SHELL := /bin/bash

.DEFAULT_GOAL := help

DOCKER_COMPOSE ?= docker compose
COMPOSE_FILE ?= src/docker-compose.yml

COMPOSE_CMD = $(DOCKER_COMPOSE) -f $(COMPOSE_FILE)

.PHONY: help up down logs verify seed

help:
	@echo "Available targets:"
	@echo "  make up       - Start the MING + Frigate stack (via $(COMPOSE_FILE))"
	@echo "  make down     - Stop the stack"
	@echo "  make logs     - Tail logs from all services"
	@echo "  make verify   - Run scripts/verify_stack.sh"
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
