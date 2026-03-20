API-platform queue services now avoid opening Redis connections during tests by using no-op in-memory queue stubs when NODE_ENV=test or test env flags are present.
