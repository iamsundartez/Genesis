import sys
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, to_timestamp, current_timestamp, sha2, concat_ws, lit

def create_spark_session(app_name="GenesisDataIngestion"):
    """Initialize and return a PySpark session."""
    return SparkSession.builder \
        .appName(app_name) \
        .config("spark.sql.shuffle.partitions", "200") \
        .config("spark.memory.fraction", "0.8") \
        .getOrCreate()

def normalize_laboratory_metadata(spark, input_path, output_path):
    """
    Reads laboratory metadata, cleanses, standardizes schemas, and 
    prepares embeddings metadata for Milvus vector database ingestion.
    """
    # 1. High-Velocity Ingestion (Micro-batching / Batch)
    print(f"Ingesting raw laboratory data from: {input_path}")
    raw_df = spark.read.json(input_path)

    # 2. Schema Normalization & Cleansing
    normalized_df = raw_df \
        .withColumn("processed_timestamp", current_timestamp()) \
        .withColumn("experiment_date", to_timestamp(col("date_logged"), "yyyy-MM-dd'T'HH:mm:ss.SSSX")) \
        .drop("date_logged") \
        .na.fill({
            "security_clearance_required": "UNCLASSIFIED",
            "department": "DOE_GENERAL"
        })

    # 3. Generating Immutable Context Hash for Vector Storage
    # This ensures RAG context integrity.
    context_df = normalized_df.withColumn(
        "context_hash", 
        sha2(concat_ws("||", col("experiment_id"), col("research_summary"), col("department")), 256)
    )

    # 4. Filter out malformed records
    clean_df = context_df.filter(col("experiment_id").isNotNull() & col("research_summary").isNotNull())

    # 5. Output to structured Parquet for Milvus embedding ingestion pipeline
    print(f"Writing normalized data to: {output_path}")
    clean_df.write \
        .mode("overwrite") \
        .partitionBy("department", "security_clearance_required") \
        .parquet(output_path)
    
    print("Normalization complete.")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: normalize_metadata.py <input_path> <output_path>")
        sys.exit(1)

    input_data_path = sys.argv[1]
    output_data_path = sys.argv[2]

    spark_session = create_spark_session()
    try:
        normalize_laboratory_metadata(spark_session, input_data_path, output_data_path)
    finally:
        spark_session.stop()
