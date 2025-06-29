<template>
  <div id="app">
    <h1>升级管理</h1>
    <h2>可用版本</h2>
    <ul>
      <li v-for="upgrade in upgrades" :key="upgrade.version">
        {{ upgrade.version }} - <el-link type="primary" :href="upgrade.path">下载</el-link>
        <el-button link type="danger" @click="deleteUpgrade(upgrade.version)" class="ml-2.5"
          >删除</el-button
        >
      </li>
    </ul>

    <h2>上传新版本</h2>
    <input type="file" @change="handleFileUpload" accept=".zip" />
    <input type="text" v-model="newVersion" placeholder="版本号 (e.g., v01.03)" />
    <el-button type="primary" @click="uploadFile" class="ml-2.5">上传</el-button>

    <!-- <el-upload
      ref="upload"
      class="upload-demo"
      action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
      :limit="1"
      :on-exceed="handleExceed"
      :auto-upload="false"
    >
      <template #trigger>
        <el-button type="primary">select file</el-button>
      </template>
      <el-button class="ml-3" type="success" @click="submitUpload"> upload to server </el-button>
      <template #tip>
        <div class="el-upload__tip text-red">limit 1 file, new file will cover the old file</div>
      </template>
    </el-upload> -->
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const serverPath = import.meta.env.VITE_SERVER_URL;
const upgrades = ref([]);
const newVersion = ref("");
let selectedFile = ref(null);

const fetchUpgrades = async () => {
  const response = await fetch(`${serverPath}/upgrades`);
  upgrades.value = await response.json();
  console.log("版本信息", upgrades.value);
};

const handleFileUpload = (event) => {
  selectedFile.value = event.target.files[0];
  if (selectedFile.value) {
    const fileName = selectedFile.value.name;
    const versionMatch = fileName.match(/v\d+\.\d+/);
    if (versionMatch) {
      newVersion.value = versionMatch[0];
    }
  }
};

const uploadFile = async () => {
  const formData = new FormData();
  formData.append("file", selectedFile.value);
  formData.append("version", newVersion.value);

  await fetch(`${serverPath}/upgrades/upload`, {
    method: "POST",
    body: formData,
  });

  fetchUpgrades(); // 重新获取版本列表
};

const deleteUpgrade = async (version) => {
  if (window.confirm("是否确定删除该版本？")) {
    await fetch(`${serverPath}/upgrades/${version}`, {
      method: "DELETE",
    });

    fetchUpgrades(); // 重新获取版本列表
  }
};

// 组件挂载时获取版本列表
onMounted(() => {
  fetchUpgrades();
});
</script>

<style scoped>
body {
  font-family: "宋体", SimSun, serif;
  font-size: 14px;
}
</style>
