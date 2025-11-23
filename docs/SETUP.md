## PostgreSQL

### Init setup

1. Create data folder
    ```sh
    mkdir -p data/postgres
    ```
2. Set permissions

   ```sh
   sudo chown -R 999:999 data/postgres
   ```
    
   Postgres uses UID 999 in official images.

3. Inspect disk usage

   ```sh
   du -sh data/postges
   ```
