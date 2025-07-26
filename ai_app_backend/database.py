"""
Database configuration module.

This module sets up a SQLAlchemy engine and session factory for connecting
to a local SQLite database.  The database file will be created in the
working directory if it does not exist.  SQLAlchemy's declarative base
is exposed so that models can inherit from it.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base


# SQLite database URL.  For production you may replace this with a
# PostgreSQL or MySQL connection string.
SQLALCHEMY_DATABASE_URL = "sqlite:///./app.db"


# The `check_same_thread` argument is required only for SQLite.  It
# allows multiple threads (such as the FastAPI request handlers) to
# interact with the database connection.  SQLAlchemy handles thread
# safety for us.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)


# Create a configured "Session" class.  Each session is a
# database handle used for ORM operations.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Base class for our ORM models.  All model classes should inherit from this.
Base = declarative_base()