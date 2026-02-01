from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean
from datetime import datetime
from config.database import Base

class PipelineDB(Base):
    __tablename__ = "pipelines"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    nodes = Column(Text, nullable=False)
    edges = Column(Text, nullable=False)
    num_nodes = Column(Integer)
    num_edges = Column(Integer)
    is_dag = Column(Boolean)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
