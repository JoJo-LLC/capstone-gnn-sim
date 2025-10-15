fn main() {
    // Watch the actual paths inside src-tauri
    println!("cargo:rerun-if-changed=docker-compose.cpu.yml");
    println!("cargo:rerun-if-changed=docker-compose.gpu.yml");
    println!("cargo:rerun-if-changed=backend");

    tauri_build::build();
}
