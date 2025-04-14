// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri_plugin_store::{StoreBuilder, StoreCollection};

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![store_api_key, get_api_key,])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn store_api_key(
    store: tauri::State<StoreCollection>,
    service: String,
    key: String,
) -> Result<(), String> {
    let mut api_store = StoreBuilder::new("api_keys.json").build();
    api_store
        .insert(service.clone(), key.into())
        .map_err(|e| e.to_string())?;
    api_store.save(store.inner()).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn get_api_key(store: tauri::State<StoreCollection>, service: String) -> Result<String, String> {
    let api_store = StoreBuilder::new("api_keys.json").build();
    let value = api_store.get(service.clone()).ok_or("Key not found")?;
    Ok(value.as_str().unwrap_or_default().to_string())
}
